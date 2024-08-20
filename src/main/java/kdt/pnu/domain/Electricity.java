package kdt.pnu.domain;

import java.time.LocalDate;


import jakarta.persistence.Column;
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
public class Electricity {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int electricity_id;
	@Builder.Default
	@Column(name = "date", columnDefinition = "DATE")
    private LocalDate date = LocalDate.now();
	private double elec_avg;
	private double num_houses; 
	private String city; 
	private double price_avg; 
	private String county; 
		
}
