<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::all());
    }

    public function show($id)
    {
        $user = User::find($id);
        if ($user) return response()->json($user);
        return response()->json(['error' => 'Not found'], 404);
    }
    
    // Admin creates user or user register
    public function store(Request $request) {
         // Simplified creation
         $user = User::create([
             'name' => $request->name,
             'email' => $request->email,
             'password' => Hash::make($request->password), 
             'role' => $request->role ?? 'client',
             'phone' => $request->phone,
             'address' => $request->address
         ]);
         return response()->json(['message' => 'User created', 'userID' => $user->userID]);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['error' => 'Not found'], 404);
        
        $data = $request->except(['password', 'email', 'userID']); // Exclude guarded or sensitive if needed
        
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }
        
        // Allow email update if valid/unique? For now allow it.
        if ($request->filled('email')) {
             $data['email'] = $request->email;
        }
        
        $user->update($data);
        return response()->json(['success' => true, 'message' => 'Updated successfully']);
    }

    public function destroy($id)
    {
        User::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
