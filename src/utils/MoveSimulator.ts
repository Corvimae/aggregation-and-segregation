import TileData from "data/TileData";
import { AppState } from "store/AppStore";
import { Store } from "vuex";

import * as tiles from "store/TileStore";
import * as teams from "store/TeamStore";

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

type NeighborData = {
	tiles: TileData[],
	counts: TeamCountCollection
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
	private grid: tiles.TileGrid;
	private teamList: { [key: number]: Team } = {};

	private neighborStore: { [key: string]: NeighborData } = {};


	constructor(store: Store<any>) {
		this.store = store;
		this.grid = tiles.getTiles(store);

		teams.getTeams(store).forEach(team => this.teamList[team.id] = team);
	}

	public step() {
		// Find the first unhappy tile
		const newGrid: tiles.TileGrid = [];

		this.neighborStore = {};

		this.grid.forEach((row, y) => {
			newGrid.push([]);
			row.forEach((tile, x) => {
				const newTile = _.clone(tile);
				if (this.isTileUnhappy(newTile)) {
					const match: TileData | undefined = this.findFirstAcceptableTile(newTile);

					if (match) {
						// Move the unhappy team member to that position.
						match.teamId = newTile.teamId;
					}

					newTile.teamId = -1;
				}

				newGrid[y].push(newTile);
			});
		});

		tiles.updateTiles(this.store, { tiles: newGrid, saveState: true });
		//tiles.updateTiles(this.store, _.uniqWith(tilesToUpdate, (a, b) => a.x === b.x && a.y === b.y));
	}

	private findFirstAcceptableTile(source: TileData): TileData | undefined {
		const team: Team | undefined = this.teamList[source.teamId];

		if (team) {
			const firstHappy: TileData | undefined = this.getNearestValidTile(source, team);

			if (firstHappy) {
				return firstHappy;
			}
		}

		return undefined;
	}

	getNearestValidTile(source: TileData, team: Team) {
		const checkTile = (x: number, y: number) => {
			const tile = this.grid[y] && this.grid[y][x];

			return tile && tile.teamId === -1 && !this.isTileUnhappy(tile, team);
		};

		const searchRing = (r: number) => {
			for (let x = source.x - r; x < source.x + r; x++) {
				if (checkTile(x, source.y - r)) return this.grid[source.y - r][x];
			}

			for (let y = source.y - r; y <= source.y + r; y++) {
				if (checkTile(source.x - 1, y)) return this.grid[y][source.x - 1];
			}

			for (let x = source.x + r; x > source.x - r; x--) {
				if (checkTile(x, source.y + r)) return this.grid[source.y + r][x];
			}

			for (let y = source.y + r; y > source.y - r; y--) {
				if (checkTile(source.x + 1, y)) return this.grid[y][source.x + 1];
			}

			return undefined;
		}

		const maxRadius: number = Math.max(source.x, source.y, Math.abs(source.x - this.grid[0].length), Math.abs(source.y - this.grid.length));

		switch (team.searchMethod) {
			case "PreferNearest":
				for (let i = 1; i <= maxRadius; i++) {
					const result = searchRing(i);

					if (result) return result;
				}

				return undefined;
			case "PreferFarthest":
				for (let i = maxRadius; i >= 1; i--) {
					const result = searchRing(i);

					if (result) return result;
				}

				return undefined;
		}

		// Default is left-to-right.
		for (let y = 0; y < this.grid.length; y++) {
			for (let x = 0; x < this.grid[0].length; x++) {
				if (checkTile(x, y)) return this.grid[y][x];
			}
		}

		return undefined;
	}

	private isTileUnhappy(tile: TileData, withTeam?: Team): boolean {
		const team: Team | undefined = withTeam || this.teamList[tile.teamId];;

		if (!team) return false;

		const neighborData = this.getNeighbors(tile);

		for (let rule of team.rules) {
			if (this.isConditionViolated(rule, neighborData)) return true;
		}

		return false;
	}

	private countTilesByTeamId(tiles: TileData[]): TeamCountCollection {
		return _.toPlainObject(_.countBy(tiles, tile => tile.teamId));
	}

	private isConditionViolated(rule: TeamSelectionRule, neighbors: NeighborData) {
		let count = neighbors.counts[rule.limitingTeamId];

		// NoTeamRule just uses -1.
		if (rule.limitingTeamId === AnyTeamRule) {
			count = neighbors.tiles.length - count;
		}

		// Calculate as if the condition is positive ("must have").
		const failsLimit = !rule.getComparitorFunction()(count, rule.limit);

		return rule.isPositive ? failsLimit : !failsLimit;
	}

	private getNeighbor(tile: TileData, offset: Coordinate): TileData | undefined {
		return this.grid[tile.y + offset.y] && this.grid[tile.y + offset.y][tile.x + offset.x];
	}

	private getNeighbors(tile: TileData): NeighborData {
		const memoized = this.neighborStore[tile.x + "," + tile.y];

		if (memoized) {
			return memoized;
		} else {
			const response: NeighborData = {
				tiles: [],
				counts: {}
			};

			// [4] is false as it's the observing tile (that is, the offset is (0, 0)).
			let statuses: boolean[] = [true, true, true, true, false, true, true, true, true];

			const team: Team | undefined = this.teamList[tile.teamId];

			if (team) {
				// Do not include tiles about which the team does not care.
				statuses = team.neighborStatuses;
			}

			statuses.forEach((status, index) => {
				if (status) {
					const neighbor: TileData | undefined = this.getNeighbor(tile, CoordinateMapping[index]);

					if (neighbor) response.tiles.push(neighbor);
				}
			})

			response.tiles.forEach(neighbor => {
				if (!response.counts[neighbor.teamId]) {
					response.counts[neighbor.teamId] = 1;
				} else {
					response.counts[neighbor.teamId] += 1;
				}
			});

			this.neighborStore[tile.x + "," + tile.y] = response;

			return response;
		}
	}
}