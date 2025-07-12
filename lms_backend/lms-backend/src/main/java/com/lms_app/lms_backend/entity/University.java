package com.lms_app.lms_backend.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class University {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String uniName;
    private String estYear;
    private String address;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String adminName;
    private int students;
    private int courses;

    public enum Status {
        ACTIVE, INACTIVE
    }

    @OneToMany(mappedBy = "university", cascade = CascadeType.ALL)
    private List<Students> studentList;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

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

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
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

	public List<Students> getStudentList() {
		return studentList;
	}

	public void setStudentList(List<Students> studentList) {
		this.studentList = studentList;
	}

    // Getters and Setters
    
}