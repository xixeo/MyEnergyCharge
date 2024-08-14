package kdt.pnu;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import kdt.pnu.domain.Members;
import kdt.pnu.domain.Role;
import kdt.pnu.persistence.MembersRepository;

@SpringBootTest
public class MemberInit {
	@Autowired
	MembersRepository memRepo;
	PasswordEncoder encoder = new BCryptPasswordEncoder();
	@Test
	public void doWork() {
		memRepo.save(Members.builder()
				.username("member1")
				.password(encoder.encode("abcd"))
				.role(Role.ROLE_MEMBER)
				.enabled(true).build());
		memRepo.save(Members.builder()
				.username("member2")
				.password(encoder.encode("abcd"))
				.role(Role.ROLE_MEMBER)
				.enabled(true).build());
		memRepo.save(Members.builder()
				.username("admin")
				.password(encoder.encode("abcd"))
				.role(Role.ROLE_ADMIN)
				.enabled(true).build());
	}
}
