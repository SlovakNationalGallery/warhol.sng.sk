<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/images', function () {
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
})->middleware('throttle:100,1');


Route::middleware('throttle:10,1')->post('/images', function (Request $request) {
        $data = $request->validate([
            'image' => ['required', 'string', 'max:500000', 'regex:/^data:image\/png;base64,/'],
        ]);

        $filename = 'can_' . time() . '.png';
        Storage::disk('public')->putFileAs('saved_cans', $data['image'], $filename);

        return response()->json(['filename' => $filename]);
})->middleware('validate-domain');