package kdt.pnu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class KdtProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(KdtProjectApplication.class, args);
	}

}
