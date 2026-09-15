export interface ForgotPasswordResponse {
  status: string;
  statusMessage: string;
  data: any;
  statusCode: number;
}

export async function forgotPassword(_email: string): Promise<ForgotPasswordResponse> {
  return {
    status: 'success',
    statusMessage: 'Password reset link sent to your email',
    data: null,
    statusCode: 200,
  };
}

export async function resetPassword(_token: string, _newPassword: string): Promise<ForgotPasswordResponse> {
  return {
    status: 'success',
    statusMessage: 'Password reset successfully',
    data: null,
    statusCode: 200,
  };
}
