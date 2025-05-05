import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import {  Observable, Subject, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import  { User } from "../models/user.model"
import { environment } from "src/environments/environment"

@Injectable({
  providedIn: "root",
})
export class CollaborationService {
  private apiUrl = `${environment.apiUrl}/collaboration`
  private webSocketUrl = environment.webSocketUrl
  private socket: WebSocket | null = null

  private messageSubject = new Subject<any>()
  public messages$ = this.messageSubject.asObservable()

  constructor(private http: HttpClient) {}

  // Initialize WebSocket connection
  initializeWebSocket(userId: string): void {
    this.socket = new WebSocket(`${this.webSocketUrl}?userId=${userId}`)

    this.socket.onopen = () => {
      console.log("WebSocket connection established")
    }

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.messageSubject.next(data)
    }

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    this.socket.onclose = () => {
      console.log("WebSocket connection closed")
      // Attempt to reconnect after a delay
      setTimeout(() => this.initializeWebSocket(userId), 5000)
    }
  }

  // Close WebSocket connection
  closeWebSocket(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  // Send a message through WebSocket
  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    } else {
      console.error("WebSocket is not connected")
    }
  }

  // Get online users
  getOnlineUsers(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/online-users`).pipe(catchError(this.handleError))
  }

  // Get user presence status
  getUserPresence(userId: string): Observable<{ status: "online" | "away" | "offline"; lastActive: Date }> {
    return this.http.get<any>(`${this.apiUrl}/presence/${userId}`).pipe(catchError(this.handleError))
  }

  // Update user presence status
  updateUserPresence(status: "online" | "away"): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/presence`, { status }).pipe(catchError(this.handleError))
  }

  // Get users currently viewing a task
  getTaskViewers(taskId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/task/${taskId}/viewers`).pipe(catchError(this.handleError))
  }

  // Notify that user is viewing a task
  notifyTaskViewing(taskId: string, isViewing: boolean): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/task/${taskId}/viewing`, { isViewing })
      .pipe(catchError(this.handleError))
  }

  // Get recent activity for a workflow
  getRecentActivity(
    workflowId: string,
    limit = 20,
  ): Observable<
    Array<{
      id: string
      type: string
      entityId: string
      entityType: string
      userId: string
      timestamp: Date
      details: any
    }>
  > {
    return this.http
      .get<any>(`${this.apiUrl}/workflow/${workflowId}/activity?limit=${limit}`)
      .pipe(catchError(this.handleError))
  }

  // Get mentions for current user
  getUserMentions(limit = 20): Observable<
    Array<{
      id: string
      taskId: string
      commentId: string
      mentionedBy: string
      timestamp: Date
      content: string
      isRead: boolean
    }>
  > {
    return this.http.get<any>(`${this.apiUrl}/mentions?limit=${limit}`).pipe(catchError(this.handleError))
  }

  // Mark mention as read
  markMentionAsRead(mentionId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/mentions/${mentionId}/read`, {}).pipe(catchError(this.handleError))
  }

  // Get user notifications
  getUserNotifications(limit = 20): Observable<
    Array<{
      id: string
      type: string
      entityId: string
      entityType: string
      timestamp: Date
      content: string
      isRead: boolean
    }>
  > {
    return this.http.get<any>(`${this.apiUrl}/notifications?limit=${limit}`).pipe(catchError(this.handleError))
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: string): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/notifications/${notificationId}/read`, {})
      .pipe(catchError(this.handleError))
  }

  // Handle API errors
  private handleError(error: any) {
    console.error("Collaboration API error:", error)
    return throwError(() => new Error(error.message || "Unknown error occurred"))
  }
}
