<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::middleware('throttle:20,1')->get('/images', function () {
    $images = collect(Storage::disk('public')->files('saved_cans'))
        ->filter(function ($path) {
            return Str::endsWith($path, '.png');
        })
        ->sortByDesc(function ($path) {
            return Storage::disk('public')->lastModified($path);
        })
        ->take(10)
        ->values()
        ->map(function ($path) {
            return asset('storage/' . $path);
        });

    return $images;
}); //->domain('warhol.sng.sk');