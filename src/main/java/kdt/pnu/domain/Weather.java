package kdt.pnu.domain;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Weather {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int weather_id; 
	
	private String city; 
	private String county; 
	private double tmpr; 
	private double rhwt; 
	private double ws;
	private Date date; 
	private int hour; 
}

