package kdt.pnu.domain;

import java.util.Date;

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
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Forum implements Comparable<Forum>{
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer forum_id; 
	@Builder.Default
	private Date date = new Date(); 
	@Column(nullable = false)
	private String username; 
	@Column(nullable = false)
	private Double elec_total; 
	private String comment; 
	private String region;
	private Double elec_diff; 
	private Integer days_diff; 
	
	
	@Override
	public int compareTo(Forum o) {
		if (this.getDate()==null || o.getDate() == null) 
			return 0;
		return this.getDate().compareTo(o.getDate()); 
	} 
	
}
