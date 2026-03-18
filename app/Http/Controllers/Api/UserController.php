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
         return response()->json(['message' => 'User created', 'id' => $user->id]);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['error' => 'Not found'], 404);
        
        // Validate password if it's being updated
        if ($request->filled('password')) {
            if (!$request->filled('current_password')) {
                return response()->json(['error' => 'Vui lòng nhập mật khẩu hiện tại.'], 422);
            }
            
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json(['error' => 'Mật khẩu hiện tại không chính xác.'], 422);
            }

            if (strlen($request->password) < 8) {
                return response()->json(['error' => 'Mật khẩu mới phải có ít nhất 8 ký tự.'], 422);
            }
        }

        $data = $request->except(['password', 'email', 'id']);
        
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }
        
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
