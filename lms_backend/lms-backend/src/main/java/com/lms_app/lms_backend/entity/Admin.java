package com.lms_app.lms_backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String adminName;
    private String uniName;
    private String role;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String email;
    private int students;
    private Long phnnum;
    private int department;

    @Enumerated(EnumType.STRING)
    private AdminStatus adminStatus;

    public enum Status {
        ACTIVE, INACTIVE
    }

    public enum AdminStatus {
        ACTIVE, INACTIVE
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getAdminName() {
		return adminName;
	}

	public void setAdminName(String adminName) {
		this.adminName = adminName;
	}

	public String getUniName() {
		return uniName;
	}

	public void setUniName(String uniName) {
		this.uniName = uniName;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public int getStudents() {
		return students;
	}

	public void setStudents(int students) {
		this.students = students;
	}

	public Long getPhnnum() {
		return phnnum;
	}

	public void setPhnnum(Long phnnum) {
		this.phnnum = phnnum;
	}

	public int getDepartment() {
		return department;
	}

	public void setDepartment(int department) {
		this.department = department;
	}

	public AdminStatus getAdminStatus() {
		return adminStatus;
	}

	public void setAdminStatus(AdminStatus adminStatus) {
		this.adminStatus = adminStatus;
	}

    // Getters and Setters
    
}
