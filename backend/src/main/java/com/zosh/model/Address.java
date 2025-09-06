package com.zosh.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Changed for better performance
    private Long id;

    private String name;

    private String locality;

    private String address;

    private String city;

    private String state;

    private String pinCode;

    private String mobile;

    // --- THIS IS THE REQUIRED RELATIONSHIP ---
    @ManyToOne
    @JoinColumn(name = "user_id") // Creates a 'user_id' foreign key column
    @JsonIgnore // Prevents infinite loops when converting to JSON
    private User user;
    // ------------------------------------------
}