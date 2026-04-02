package com.example.demo;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		// Set JVM default timezone to Turkey time so LocalDateTime.now() and other
		// time-sensitive calls use Europe/Istanbul by default.
		TimeZone.setDefault(TimeZone.getTimeZone("Europe/Istanbul"));
		SpringApplication.run(DemoApplication.class, args);
	}

}
