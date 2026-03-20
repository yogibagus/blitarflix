import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    if (!secretKey) {
      console.error('TURNSTILE_SECRET_KEY is not defined');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Verify token with Cloudflare Turnstile
    const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);

    // Add remote IP if available (optional but recommended)
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') ||
               'unknown';
    
    if (ip !== 'unknown') {
      formData.append('remoteip', ip);
    }

    const response = await fetch(verifyUrl, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      return NextResponse.json({ 
        success: true,
        // Optional: You can include additional info from the result
        // challenge_ts: result.challenge_ts,
        // hostname: result.hostname
      });
    } else {
      console.error('Turnstile validation failed:', result['error-codes']);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          errorCodes: result['error-codes'] 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying Turnstile token:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}