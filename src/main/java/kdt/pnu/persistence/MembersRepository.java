package kdt.pnu.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import kdt.pnu.domain.Members;


public interface MembersRepository extends JpaRepository<Members, String>{
	
}
