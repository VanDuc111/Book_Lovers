<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
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

    public function updateAvatar(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['error' => 'Người dùng không tồn tại.'], 404);

        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $filename = time() . '_' . $id . '.jpg';
            
            // Đường dẫn thư mục đích trong public
            $destinationPath = public_path('assets/avatars');
            
            // Tạo thư mục nếu chưa tồn tại
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            // Xóa ảnh cũ nếu có trong assets/avatars
            if ($user->avatar && str_contains($user->avatar, 'assets/avatars')) {
                $oldPath = public_path($user->avatar);
                if (file_exists($oldPath)) @unlink($oldPath);
            }

            // Lưu ảnh mới vào public/assets/avatars
            $file->move($destinationPath, $filename);

            // Cập nhật Database với đường dẫn public
            $user->avatar = '/assets/avatars/' . $filename;
            $user->save();

            return response()->json([
                'success' => true,
                'avatar_url' => $user->avatar,
                'message' => 'Cập nhật ảnh đại diện thành công.'
            ]);
        }

        return response()->json(['error' => 'Không tìm thấy file.'], 400);
    }

    public function destroy($id)
    {
        User::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
