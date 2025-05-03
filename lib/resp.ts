import { NextResponse } from 'next/server';

export function success(data: any = null, message: string = 'Success') {
  return NextResponse.json({
    success: true,
    message,
    data
  });
}

export function error(message: string = 'Error', status: number = 400) {
  return NextResponse.json({
    success: false,
    message
  }, { status });
}

export function unauthorized(message: string = 'Unauthorized') {
  return NextResponse.json({
    success: false,
    message
  }, { status: 401 });
}

export function forbidden(message: string = 'Forbidden') {
  return NextResponse.json({
    success: false,
    message
  }, { status: 403 });
}

export function notFound(message: string = 'Not Found') {
  return NextResponse.json({
    success: false,
    message
  }, { status: 404 });
}

// Add the missing respData and respErr functions
export function respData(data: any = null, message: string = 'Success') {
  return NextResponse.json({
    success: true,
    message,
    data
  });
}

export function respErr(message: string = 'Error', status: number = 400) {
  return NextResponse.json({
    success: false,
    message
  }, { status });
}
