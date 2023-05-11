<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Config;

class ValidateDomain
{
    public function handle($request, Closure $next)
    {
        $allowedDomains = Config::get('app.allowed_domains');

        $referer = $request->headers->get('referer');
        $parsedUrl = parse_url($referer);

        if (!in_array($parsedUrl['host'], $allowedDomains)) {
            return response('Unauthorized', 401);
        }

        return $next($request);
    }
}