+ Di chuyển tất cả các route vào file ```routes.js```. Đang xem xét tách route của mỗi module ra một file riêng.
+ Tách logic ra khỏi route. Route chỉ là đường dẫn đến một hoặc nhiều action của controller. Áp dụng mô hình MVC.
+ Đang nghiên cứu đưa logic vào trong model chứ không để trong action của controller. Controller chỉ có tác dụng điều hướng IO.
+ Loại bỏ các thư mục không cần đến ra khỏi git repo.
+ Loại bỏ thư mục ```node_modules``` ra khỏi git repo. Thư mục ```node_modules``` chứa các dependency cho project, nhưng mỗi hệ thống (Windows, Linux, MacOSX)
lại build ra khác nhau nên phải loại bỏ ra khỏi repo.
+ Đưa các module thiếu vào trong ```package.json```.
+ Áp dụng module ```config``` vào code. Cho phép lưu configuration cho các môi trường khác nhau: development, staging, production.
Đọc thêm tại đây: [node-config](https://github.com/lorenwest/node-config)
+ Chỉnh sửa lại một số logic trong code.
+ Mới sửa lại logic của login theo chuẩn mới. Thiếu một số route (chưa push lên repo?).