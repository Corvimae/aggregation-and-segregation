import TileData from "data/TileData";
import { AppState } from "store/AppStore";
import { Store } from "vuex";

import * as tiles from "store/TileStore";

import * as  _ from "lodash";
import { Team, TeamSelectionRule, NoTeamRule, AnyTeamRule } from "data/Team";

export class Coordinate {
	public x: number;
	public y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(other: Coordinate): Coordinate {
		return new Coordinate(this.x + other.x, this.y + other.y);
	}

	isValidOnGrid(width?: number, height?: number): boolean {
		return this.x >= 0 && this.y >= 0 && (!width || this.x < width) && (!height || this.y < height);
	}
};

export const CoordinateMapping: Coordinate[] = [
	new Coordinate(-1, -1),
	new Coordinate(0, -1),
	new Coordinate(1, -1),
	new Coordinate(-1, 0),
	new Coordinate(0, 0),
	new Coordinate(1, 0),
	new Coordinate(-1, 1),
	new Coordinate(0, 1),
	new Coordinate(1, 1)
];

export interface TeamCountCollection { [key: number]: number };

export default class MoveSimulator {
	private store: Store<any>;
	private grid: TileData[];

	constructor(store: Store<any>) {
		this.store = store;
		this.grid = tiles.getTiles(store);
	}

	public step() {
		// Find the first unhappy tile
		const newGrid: TileData[] = [];

		this.grid.forEach(tile => {
			if (this.isTileUnhappy(tile)) {
				const match: TileData | undefined = this.findFirstAcceptableTile(tile);

				if (match) {
					// Move the unhappy team member to that position.
					match.teamId = tile.teamId;
				}

				tile.teamId = -1;
			}

			newGrid.push(tile);
		});

		tiles.updateTiles(this.store, newGrid);
		//tiles.updateTiles(this.store, _.uniqWith(tilesToUpdate, (a, b) => a.x === b.x && a.y === b.y));
	}

	private findFirstAcceptableTile(source: TileData): TileData | undefined {
		const team: Team | undefined = source.getTeam(this.store);

		if (team) {
			const firstHappy: TileData | undefined = _.find(
				team.getSearchOrderingMethod()(source, this.grid),
				tile => !this.isTileUnhappy(tile, team) && tile.teamId === -1
			);

			if (firstHappy) {
				return firstHappy;
			}
		}

		return undefined;
	}

	private isTileUnhappy(tile: TileData, withTeam?: Team): boolean {
		const team: Team | undefined = withTeam || tile.getTeam(this.store);

		if (!team) return false;

		const neighbors = this.getNeighbors(tile);
		const neighborTeamCounts = this.countTilesByTeamId(neighbors);

		return _.some(team.rules.map(rule => this.isConditionViolated(rule, neighborTeamCounts)), item => item === true);
	}

	private countTilesByTeamId(tiles: TileData[]): TeamCountCollection {
		return _.toPlainObject(_.countBy(tiles, tile => tile.teamId));
	}

	private isConditionViolated(rule: TeamSelectionRule, neighborTeamCounts: TeamCountCollection) {
		let count = neighborTeamCounts[rule.limitingTeamId];

		if (rule.limitingTeamId === AnyTeamRule) {
			count = _.reduce(neighborTeamCounts, (total, num, key) => key === "-1" ? total : total + num, 0);
		} else if (rule.limitingTeamId === NoTeamRule) {
			count = _.reduce(neighborTeamCounts, (total, num, key) => key === "-1" ? total + num : total, 0);
		}

		// Calculate as if the condition is positive ("must have").
		const failsLimit = !rule.getComparitorFunction()(count, rule.limit);

		return rule.isPositive ? failsLimit : !failsLimit;
	}

	private getNeighbor(tile: TileData, offset: Coordinate): TileData | undefined {
		return tiles.getTileByCoordinate(this.store)(new Coordinate(tile.x, tile.y).add(offset));
	}

	private getNeighbors(tile: TileData): TileData[] {
		const response: TileData[] = [];

		// [4] is false as it's the observing tile (that is, the offset is (0, 0)).
		let statuses: boolean[] = [true, true, true, true, false, true, true, true, true];

		const team: Team | undefined = tile.getTeam(this.store);

		if (team) {
			// Do not include tiles about which the team does not care.
			statuses = team.neighborStatuses;
		}

		statuses.forEach((status, index) => {
			if (status) {
				const neighbor: TileData | undefined = this.getNeighbor(tile, CoordinateMapping[index]);

				if (neighbor) response.push(neighbor);
			}
		})

		return response;
	}
}