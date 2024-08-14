package kdt.pnu.domain;

import java.util.Date;


import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Members {
	
	@Id
	private String username; 
	
	private String password; 
	private String email; 
	
	private Date regidate; 		
	
	@Enumerated(EnumType.STRING)
	private Role role; 
	private boolean enabled; 
}
