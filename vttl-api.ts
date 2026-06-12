// vttl api types

export interface VttlClub {
  LongName: string;
  UniqueIndex: string;
}

export interface VttlMatchResult {
  Date: string;
  UniqueIndex: number;
  FirstName: string;
  LastName: string;
  Ranking: string;
  Result: string;
  SetFor: number;
  SetAgainst: number;
  CompetitionType: string;
  Club: string;
  MatchId: string;
  MatchUniqueId: number;
}

export interface VttlMember {
  UniqueIndex: number;
  FirstName: string;
  LastName: string;
  Ranking: string;
  Status: string;
  Club: string;
  ResultEntries?: VttlMatchResult[];
}

// request/response types
export interface GetClubsParams {
  Season: number;
  ClubCategory?: number;
}

export interface GetMembersParams {
  Season: number;
  Club: string;
  NameSearch?: string;
  WithResults: boolean;
}

export interface GetClubsResult {
  ClubEntries: VttlClub[];
}

export interface GetMembersResult {
  MemberEntries: VttlMember[];
}

// legacy aliases
export type ClubEntry = VttlClub;
export type MatchResult = VttlMatchResult;
export type Member = VttlMember;
