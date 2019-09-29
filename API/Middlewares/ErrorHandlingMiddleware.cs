
using System;
using System.Net;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace API.Middlewares
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;
        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _logger = logger;
            _next = next;

        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                //If no exception occurs then move to the next pipeline in the middleware
                await _next(context);
            }
            catch (Exception exception)
            {
                await HandleExceptionAsync(context, exception, _logger);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception, ILogger<ErrorHandlingMiddleware> logger)
        {
            object errors = null;

            switch (exception)
            {
                case RestException restException:
                    logger.LogError(exception, "REST ERROR");
                    errors = restException.Errors;
                    context.Response.StatusCode = (int)restException.Code;
                    break;

                case Exception except:
                    logger.LogError(except, "SERVER ERROR");
                    errors = String.IsNullOrWhiteSpace(except.Message) ? "Error" : except.Message;
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                    break;
            }

            context.Response.ContentType = "application/json";

            if (errors != null)
            {
                //Convert error to json and send error to client
                var result = JsonConvert.SerializeObject(new { errors });
                await context.Response.WriteAsync(result);
            }
        }
    }
}