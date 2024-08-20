package kdt.pnu.service;

import java.util.Optional;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import kdt.pnu.domain.Members;
import kdt.pnu.domain.Role;
import kdt.pnu.persistence.MembersRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MembersService {
	
	private final MembersRepository memberRepo; 
	private final PasswordEncoder passwordEncoder; 
	
	public Members getMemberById(String id) {
		return memberRepo.findById(id).get();
	}
	
	public String joinMembers(Members member) {
		String username = member.getUsername(); 
		String email = member.getEmail(); 		
		Optional<Members> memberByUsername = memberRepo.findById(username); 
		Members memberByEmail = memberRepo.findByEmail(email);
		System.out.println(memberByEmail);		
		if (memberByUsername.isPresent() || memberByEmail != null) 
			return "이미 가입된 사용자입니다.";
		else {
			member.setRole(Role.ROLE_MEMBER);
			member.setEnabled(true);
			member.setPassword(passwordEncoder.encode(member.getPassword()));
			memberRepo.save(member);
			return username + "님, 가입을 축하합니다!";
		}				
	}
	
	public String unsubMembers(User user) {
		String username = user.getUsername(); 
		Members member = memberRepo.findById(username).get();
		member.setEnabled(false);
		memberRepo.save(member);
		return username + "님, 정상적으로 탈퇴되었습니다" ;
	}
}
