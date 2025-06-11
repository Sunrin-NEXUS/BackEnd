import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

interface errorResponseInterface {
  status: string,
  statusCode: number
  errorCode: string
  message: Array<string>
  path: string
  timestamp: string
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if(!(exception instanceof HttpException)) return

    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    let status = exception.getStatus()
    let responseBody: errorResponseInterface = {
      status: 'error',
      statusCode: status,
      errorCode: 'INTERNAL_ERROR',
      message: ['Internal server error'],
      path: request.url as string,
      timestamp: new Date().toISOString(),
    }

    const excRes = exception.getResponse()

    // class-validator 에러 메시지 처리
    if (typeof excRes === 'object' && 'message' in excRes) {
      if(Array.isArray(excRes.message))
        responseBody.message = excRes.message
      else if(typeof excRes.message === 'string')
        responseBody.message = [excRes.message]
      else
        throw new Error('failed to filtering exception')

      responseBody.errorCode = excRes['error'] ?? null
    } else if (typeof excRes === 'string') {
      responseBody.message = [excRes]
    }

    responseBody.status = status >= 400 && status < 500 ? 'fail' : 'error'
    response.status(status).json(responseBody)
  }
}
