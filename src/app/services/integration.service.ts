import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiKey, Integration, IntegrationProvider, WebhookDefinition } from '../models/integration.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class IntegrationService {
  private apiUrl = `${environment.apiUrl}/integrations`;
  private integrationsSubject = new BehaviorSubject<Integration[]>([]);
  integrations$ = this.integrationsSubject.asObservable();
  constructor(private http: HttpClient) {
    this.getIntegrations();
  }
  getIntegrations(): Observable<Integration[]> {
    return this.http.get<Integration[]>(this.apiUrl).pipe(
      tap((integrations) => this.integrationsSubject.next(integrations)),
      catchError(this.handleError)
    );
  }
  getIntegrationById(integrationId: string): Observable<Integration> {
    return this.http
      .get<Integration>(`${this.apiUrl}/${integrationId}`)
      .pipe(catchError(this.handleError));
  }
  createIntegration(
    integration: Partial<Integration>
  ): Observable<Integration> {
    return this.http.post<Integration>(this.apiUrl, integration).pipe(
      tap((integration) => {
        const currentIntegrations = this.integrationsSubject.getValue();
        this.integrationsSubject.next([...currentIntegrations, integration]);
      }),
      catchError(this.handleError)
    );
  }
  updateIntegration(
    integrationId: string,
    update: Partial<Integration>
  ): Observable<Integration> {
    return this.http
      .patch<Integration>(`${this.apiUrl}/${integrationId}`, update)
      .pipe(
        tap((integration) => {
          const currentIntegrations = this.integrationsSubject.getValue();
          const integrationIndex = currentIntegrations.findIndex(
            (x) => x.id === integrationId
          );
          if (integrationIndex !== -1) {
            const updatedIntegrations = [...currentIntegrations];
            updatedIntegrations[integrationIndex] = integration;
            this.integrationsSubject.next(updatedIntegrations);
          }
        }),
        catchError(this.handleError)
      );
  }
   deleteIntegration(integrationId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${integrationId}`).pipe(
      tap(() => {
        const currentIntegrations = this.integrationsSubject.getValue()
        this.integrationsSubject.next(currentIntegrations.filter((i) => i.id !== integrationId))
      }),
      catchError(this.handleError),
    )
  }

  syncIntegration(integrationId: string): Observable<{ success: boolean; message: string }> {
    return this.http
      .post<{ success: boolean; message: string }>(`${this.apiUrl}/${integrationId}/sync`, {})
      .pipe(catchError(this.handleError))
  }

  getAvailableProviders(): Observable<
    Array<{
      id: IntegrationProvider
      name: string
      description: string
      logoUrl: string
      features: string[]
    }>
  > {
    return this.http.get<any>(`${this.apiUrl}/providers`).pipe(catchError(this.handleError))
  }

  getWebhooks(): Observable<WebhookDefinition[]> {
    return this.http.get<WebhookDefinition[]>(`${this.apiUrl}/webhooks`).pipe(catchError(this.handleError))
  }

  createWebhook(webhook: Partial<WebhookDefinition>): Observable<WebhookDefinition> {
    return this.http.post<WebhookDefinition>(`${this.apiUrl}/webhooks`, webhook).pipe(catchError(this.handleError))
  }

  updateWebhook(webhookId: string, updates: Partial<WebhookDefinition>): Observable<WebhookDefinition> {
    return this.http
      .patch<WebhookDefinition>(`${this.apiUrl}/webhooks/${webhookId}`, updates)
      .pipe(catchError(this.handleError))
  }

  deleteWebhook(webhookId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/webhooks/${webhookId}`).pipe(catchError(this.handleError))
  }

  getApiKeys(): Observable<ApiKey[]> {
    return this.http.get<ApiKey[]>(`${this.apiUrl}/api-keys`).pipe(catchError(this.handleError))
  }

  createApiKey(apiKey: Partial<ApiKey>): Observable<{ key: ApiKey; plainTextKey: string }> {
    return this.http
      .post<{ key: ApiKey; plainTextKey: string }>(`${this.apiUrl}/api-keys`, apiKey)
      .pipe(catchError(this.handleError))
  }

  deleteApiKey(apiKeyId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api-keys/${apiKeyId}`).pipe(catchError(this.handleError))
  }


  private handleError(error: any) {
    return throwError(() => {
      console.error(`err:`, error);
      new Error(error.message || 'unexpected error occured');
    });
  }
}
