import * as _ from "lodash";
import TileData from "data/TileData";

export type TeamConfiguration = {
  name?: string
}

export class Team {
  public readonly id: number;

  public name: string = "";

  public backgroundColor: string;

  public neighborStatuses: boolean[] = [true, true, true, true, false, true, true, true, true];

  public rules: TeamSelectionRule[] = [];

  public searchMethod: TeamSearchMethod = "PreferNearest";

  constructor(id: number, options?: TeamConfiguration) {
    this.id = id;
    this.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    if(this.backgroundColor.length < 7) {
      this.backgroundColor = this.backgroundColor + "000000".substring(this.backgroundColor.length - 1);
    }
    
    this.name = options && options.name || `Team ${id + 1}`;
  }

  addRule(rule: TeamSelectionRule) {
    this.rules.push(rule);
  }
}

export type TeamSearchMethod = "PreferNearest" | "PreferFarthest" | "LeftToRight";

export type TeamSelectionRuleOperand = "<" | "<=" | "=" | ">=" | ">";

export const NoTeamRule = -1;
export const AnyTeamRule = -2;

export class TeamSelectionRule {
  public limitingTeamId: number;
  public limitOperand: TeamSelectionRuleOperand;
  public limit: number;
  public isPositive: boolean;

  constructor(limitingTeamId: number, limitOperand: TeamSelectionRuleOperand, limit: number, isPositive: boolean) {
    this.limitingTeamId = limitingTeamId;
    this.limitOperand = limitOperand;
    this.limit = limit;
    this.isPositive = isPositive;
  }

  getComparitorFunction(): (amount: number, limit: number) => boolean {
    switch (this.limitOperand) {
      case "<":
        return (amount, limit) => amount < limit;
      case "<=":
        return (amount, limit) => amount <= limit;
      case "=":
        return (amount, limit) => amount === limit;
      case ">=":
        return (amount, limit) => amount >= limit;
      case ">":
        return (amount, limit) => amount > limit;
    }
  }
}