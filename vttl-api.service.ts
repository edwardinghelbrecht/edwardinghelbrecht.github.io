import { createClient } from 'soap';
import type { Client } from 'soap';
import type {
  ClubEntry,
  MatchResult,
  Member,
  GetClubsParams,
  GetMembersParams,
  GetClubsResult,
  GetMembersResult
} from '../types/vttl-api';

const WSDL_PATH = 'https://api.vttl.be/0.7/index.php?wsdl';

/**
 * Service for interacting with the VTTL (Belgian Table Tennis) API
 * Handles all SOAP client operations and data fetching
 */
export class VttlApiService {
  private async createSoapClient(): Promise<Client> {
    return new Promise<Client>((resolve, reject) => {
      createClient(WSDL_PATH, (err, client) => {
        if (err) {
          reject(new Error(`Failed to create SOAP client: ${err}`));
        } else {
          resolve(client);
        }
      });
    });
  }

  /**
   * Fetch clubs from a specific province
   * @param province Province ID (6 = West-Vlaanderen)
   * @param season Season number (default: 26)
   */
  async fetchClubs(province?: number, season: number = 26): Promise<ClubEntry[]> {
    try {
      const client = await this.createSoapClient();
      
      return new Promise<ClubEntry[]>((resolve, reject) => {
        const params: GetClubsParams = { Season: season };
        
        if (province !== undefined) {
          params.ClubCategory = province;
        }

        client.GetClubs(params, (error: Error | null, result: GetClubsResult) => {
          if (error) {
            console.error('Error fetching clubs:', error);
            reject(new Error(`Failed to fetch clubs: ${error}`));
          } else if (result?.ClubEntries) {
            resolve(result.ClubEntries);
          } else {
            resolve([]);
          }
        });
      });
    } catch (error) {
      console.error('Error in fetchClubs:', error);
      throw error;
    }
  }

  /**
   * Fetch members and their match results
   * @param season Season number
   * @param club Club identifier
   * @param nameSearch Optional name search filter
   * @param withResults Include match results (default: true)
   */
  async fetchMembers(
    season: number, 
    club: string, 
    nameSearch?: string, 
    withResults: boolean = true
  ): Promise<Member[]> {
    try {
      const client = await this.createSoapClient();
      
      return new Promise<Member[]>((resolve, reject) => {
        const params: GetMembersParams = {
          Season: season,
          Club: club,
          WithResults: withResults,
        };
        
        if (nameSearch) {
          params.NameSearch = nameSearch;
        }

        client.GetMembers(params, (error: unknown, result: GetMembersResult) => {
          if (error) {
            console.error('Error fetching members:', error);
            reject(new Error(`Failed to fetch members: ${error}`));
          } else if (result?.MemberEntries) {
            resolve(result.MemberEntries);
          } else {
            resolve([]);
          }
        });
      });
    } catch (error) {
      console.error('Error in fetchMembers:', error);
      throw error;
    }
  }

  /**
   * Fetch match results for a specific player
   * @param season Season number
   * @param club Club identifier  
   * @param playerName Player name to search for
   */
  async fetchMatchResults(season: number, club: string, playerName: string): Promise<MatchResult[]> {
    try {
      const members = await this.fetchMembers(season, club, playerName, true);
      
      const matchResults: MatchResult[] = [];
      
      for (const member of members) {
        if (member.ResultEntries?.length) {
          matchResults.push(...member.ResultEntries);
        }
      }
      
      return matchResults;
      
    } catch (error) {
      console.error(`Error fetching match results for ${playerName}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const vttlApiService = new VttlApiService();

// Re-export types for convenience
export type { ClubEntry, MatchResult, Member } from '../types/vttl-api';
