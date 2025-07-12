package com.lms_app.lms_backend.dto;

public class UniversityDTO {
    private String uniName;
    private String estYear;
    private String address;
    private String status;
    private String adminName;
    private int students;
    private int courses;
	public String getUniName() {
		return uniName;
	}
	public void setUniName(String uniName) {
		this.uniName = uniName;
	}
	public String getEstYear() {
		return estYear;
	}
	public void setEstYear(String estYear) {
		this.estYear = estYear;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getAdminName() {
		return adminName;
	}
	public void setAdminName(String adminName) {
		this.adminName = adminName;
	}
	public int getStudents() {
		return students;
	}
	public void setStudents(int students) {
		this.students = students;
	}
	public int getCourses() {
		return courses;
	}
	public void setCourses(int courses) {
		this.courses = courses;
	}

    // Getters and Setters
    
}