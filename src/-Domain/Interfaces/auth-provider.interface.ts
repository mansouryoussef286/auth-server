export interface AuthProvider {
  authenticate(code: string): Promise<string>;
}
