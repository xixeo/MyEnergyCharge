package kdt.pnu.service;

import org.springframework.stereotype.Service;

import kdt.pnu.domain.Members;
import kdt.pnu.persistence.MembersRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MembersService {
	
	private final MembersRepository memberRepo; 
	
	public Members getMemberById(String id) {
		return memberRepo.findById(id).get();
	}
}
