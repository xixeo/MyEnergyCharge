package kdt.pnu.config.filter;


import java.util.Date;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kdt.pnu.domain.Members;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

	private final AuthenticationManager authManager; 
	
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) {
		ObjectMapper mapper = new ObjectMapper(); 
		try { 
			Members members = mapper.readValue(request.getInputStream(), Members.class); 
			Authentication authToken = new UsernamePasswordAuthenticationToken(members.getUsername(), members.getPassword());
			return authManager.authenticate(authToken);
		} catch(Exception e) {
			e.getMessage(); 
		}
		response.setStatus(HttpStatus.UNAUTHORIZED.value());
		return null; 
	}
	
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, 
												FilterChain chain, Authentication authResult) {
		User user = (User) authResult.getPrincipal(); 
		String token = JWT.create()
						  .withExpiresAt(new Date(System.currentTimeMillis() + 1000*60*30))
						  .withClaim("username", user.getUsername())
						  .sign(Algorithm.HMAC256("edu.pnu.jwt"));
		response.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token);
		response.setStatus(HttpStatus.OK.value());
		
	}
	
}
