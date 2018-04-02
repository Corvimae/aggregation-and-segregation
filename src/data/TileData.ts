import { Team } from "data/Team";
import { AppStore } from "store/AppStore";
import * as teams from "store/TeamStore";
import { TileState } from "store/TileStore";

export default class TileData {
  public readonly x: number;
  public readonly y: number;

  public teamId: number = -1;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public get id(): number {
    return (this.y << 16) ^ this.x;
  }

  public getTeamColor(store: AppStore): string {
    const team: Team | undefined = this.getTeam(store);

    return team ? team.backgroundColor : "#ffffff";
  }

  public getTeam(store: AppStore): Team | undefined {
    return teams.getTeamById(store)(this.teamId);
  }

  public setTeam(team: Team | undefined) {
    this.teamId = team ? team.id : -1;
  }
} 