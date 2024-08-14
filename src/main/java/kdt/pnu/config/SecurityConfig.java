package kdt.pnu.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;

import kdt.pnu.config.filter.JWTAuthenticationFilter;
import kdt.pnu.config.filter.JWTAuthorizationFilter;
import kdt.pnu.persistence.MembersRepository;

@Configuration
public class SecurityConfig {
	
	@Autowired
	private AuthenticationConfiguration authConfig;
	
	@Autowired
	private MembersRepository memRepo;
	
	@Bean
	PasswordEncoder passwordEncoder() { 
		return new BCryptPasswordEncoder();
	}	
	
	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception { 
		
		http.csrf(csrf->csrf.disable());	
		http.authorizeHttpRequests(auth -> auth
				.requestMatchers("/members/**").authenticated()
				.requestMatchers("/admin/**").hasRole("ADMIN")
				.anyRequest().permitAll()); 
		http.addFilter(new JWTAuthenticationFilter(authConfig.getAuthenticationManager()));
		http.httpBasic(basic->basic.disable()); 
		http.formLogin(frmLogin -> frmLogin.disable()); 
//		http.formLogin(form -> {});
		http.addFilterBefore(new JWTAuthorizationFilter(memRepo), AuthorizationFilter.class);
		
		return http.build();
	}
	
	
	 
}
