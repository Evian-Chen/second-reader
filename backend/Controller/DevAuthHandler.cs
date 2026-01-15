using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace backend.Auth
{
    public class DevAuthHandler
        : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        public DevAuthHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder)
            : base(options, logger, encoder)
        {
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            // 期待 Authorization: Bearer <anything>
            if (!Request.Headers.TryGetValue("Authorization", out var authHeader))
            {
                return Task.FromResult(AuthenticateResult.Fail("Missing Authorization header"));
            }

            var auth = authHeader.ToString();
            if (!auth.StartsWith("Bearer "))
            {
                return Task.FromResult(AuthenticateResult.Fail("Invalid Authorization scheme"));
            }

            // 把 Bearer 後面的字串直接當 ClerkUserId（sub）
            var fakeClerkUserId = auth.Substring("Bearer ".Length).Trim();

            if (string.IsNullOrWhiteSpace(fakeClerkUserId))
            {
                return Task.FromResult(AuthenticateResult.Fail("Empty token"));
            }

            var claims = new List<Claim>
            {
                new Claim("sub", fakeClerkUserId),
                new Claim("email", "dev@example.com"),
            };

            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
    }
}
