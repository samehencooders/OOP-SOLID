import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, throwError } from "rxjs"
import { catchError, tap } from "rxjs/operators"

import  {
  GamificationSystem,
  Level,
  BadgeDefinition,
  Challenge,
  Reward,
  Leaderboard,
} from "../models/gamification.model"
import { environment } from "src/environments/environment"

@Injectable({
  providedIn: "root",
})
export class GamificationService {
  private apiUrl = `${environment.apiUrl}`
  private userXpSubject = new BehaviorSubject<number>(0)
  private userLevelSubject = new BehaviorSubject<number>(1)
  private userBadgesSubject = new BehaviorSubject<string[]>([])

  public userXp$ = this.userXpSubject.asObservable()
  public userLevel$ = this.userLevelSubject.asObservable()
  public userBadges$ = this.userBadgesSubject.asObservable()

  constructor(private http: HttpClient) {
    this.loadUserGamificationData()
  }

  private loadUserGamificationData(): void {
    this.http
      .get<{
        xp: number
        level: number
        badges: string[]
      }>(`${this.apiUrl}/user-data`)
      .pipe(
        catchError((error) => {
          console.error("Failed to load user gamification data:", error)
          return throwError(() => new Error(error.message || "Unknown error occurred"))
        }),
      )
      .subscribe((data) => {
        this.userXpSubject.next(data.xp)
        this.userLevelSubject.next(data.level)
        this.userBadgesSubject.next(data.badges)
      })
  }

  getGamificationSystem(): Observable<GamificationSystem> {
    return this.http.get<GamificationSystem>(`${this.apiUrl}/system`).pipe(catchError(this.handleError))
  }

  getLevels(): Observable<Level[]> {
    return this.http.get<Level[]>(`${this.apiUrl}/levels`).pipe(catchError(this.handleError))
  }

  getBadgeDefinitions(): Observable<BadgeDefinition[]> {
    return this.http.get<BadgeDefinition[]>(`${this.apiUrl}/badges`).pipe(catchError(this.handleError))
  }

  getActiveChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(`${this.apiUrl}/challenges/active`).pipe(catchError(this.handleError))
  }

  getAvailableRewards(): Observable<Reward[]> {
    return this.http.get<Reward[]>(`${this.apiUrl}/rewards`).pipe(catchError(this.handleError))
  }

  getLeaderboards(): Observable<Leaderboard[]> {
    return this.http.get<Leaderboard[]>(`${this.apiUrl}/leaderboards`).pipe(catchError(this.handleError))
  }

  joinChallenge(challengeId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/challenges/${challengeId}/join`, {}).pipe(catchError(this.handleError))
  }

  claimReward(rewardId: string): Observable<{
    success: boolean
    message: string
    remainingXp: number
  }> {
    return this.http.post<any>(`${this.apiUrl}/rewards/${rewardId}/claim`, {}).pipe(
      tap((response) => {
        if (response.success) {
          this.userXpSubject.next(response.remainingXp)
        }
      }),
      catchError(this.handleError),
    )
  }

  getChallengeProgress(challengeId: string): Observable<{
    progress: number
    isCompleted: boolean
    completedItems: string[]
    remainingItems: string[]
  }> {
    return this.http.get<any>(`${this.apiUrl}/challenges/${challengeId}/progress`).pipe(catchError(this.handleError))
  }

  getUserBadges(): Observable<
    Array<{
      id: string
      name: string
      description: string
      iconUrl: string
      earnedAt: Date
      rarity: string
    }>
  > {
    return this.http.get<any>(`${this.apiUrl}/user-badges`).pipe(
      tap((badges) => {
        this.userBadgesSubject.next(badges.map((b: any) => b.id))
      }),
      catchError(this.handleError),
    )
  }

  getUserXpHistory(timeframe = "30d"): Observable<
    Array<{
      date: Date
      xp: number
      source: string
      description: string
    }>
  > {
    return this.http
      .get<any>(`${this.apiUrl}/user-xp-history?timeframe=${timeframe}`)
      .pipe(catchError(this.handleError))
  }

  getUserLeaderboardRanks(): Observable<
    Record<
      string,
      {
        rank: number
        score: number
        totalParticipants: number
      }
    >
  > {
    return this.http.get<any>(`${this.apiUrl}/user-leaderboard-ranks`).pipe(catchError(this.handleError))
  }

  private handleError(error: any) {
    console.error("Gamification API error:", error)
    return throwError(() => new Error(error.message || "Unknown error occurred"))
  }
}
