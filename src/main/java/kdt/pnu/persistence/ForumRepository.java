package kdt.pnu.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.transaction.Transactional;
import kdt.pnu.domain.Forum;

public interface ForumRepository extends JpaRepository<Forum, Integer>{

	public List<Forum> findByUsername(String username);
	
	@Modifying
	@Transactional
	@Query(value= "update forum as current "
			+ "join( "
			+ "	select  "
			+ "			f.username,  "
			+ "			f.elec_total,  "
			+ "			f.date,  "
			+ "			f.elec_diff,  "
			+ "			f.days_diff,  "
			+ "			lag(f.elec_total) over (partition by f.username order by f.date) as prev_elec_total,   "
			+ "			lag(f.date) over (partition by f.username order by f.date) as prev_date "
			+ "		from forum as f where username= :username "
			+ "	) as prev on prev.username= current.username and current.date = prev.date "
			+ "set  "
			+ "	current.elec_diff = coalesce(current.elec_total - prev.prev_elec_total, 0), "
			+ " current.days_diff = coalesce(datediff(current.date , prev.prev_date), 0);   "
			, nativeQuery = true)
	void sortForum(@Param("username") String username);
	
	
	@Query(value=" SELECT  "
			+ "    ff.*,  "
			+ "    FORMAT(MAX(w.tmpr), 1) AS max_temp,  "
			+ "    FORMAT(MIN(w.tmpr), 1) AS min_temp,  "
			+ "    FORMAT(AVG(w.tmpr), 1) AS avg_temp,  "
			+ "    FORMAT(MAX(w.rhwt), 1) AS max_rh,  "
			+ "    FORMAT(MIN(w.rhwt), 1) AS min_rh,  "
			+ "    FORMAT(AVG(w.rhwt), 1) AS avg_rh "
			+ "FROM  "
			+ "    (SELECT * FROM forum  "
			+ "    where (:username is null or username = :username)  "
			+ "			and ( :region is null or region like :region )  "
			+ "			and ( elec_diff between :elec_diff1 and :elec_diff2 )  "
			+ "			and date between :start_date and :end_date   "
			+ "    ) AS ff "
			+ "LEFT JOIN  "
			+ "    weather w  "
			+ "ON  "
			+ "    ff.date = w.date  "
			+ "    AND ff.region = w.county  "
			+ "    AND ff.city = w.city "
			+ "GROUP BY  "
			+ "    ff.date,  "
			+ "    ff.city,  "
			+ "    ff.region, "
			+ "    ff.forum_id, "
			+ "    ff.elec_diff,  "
			+ "    ff.days_diff,  "
			+ "    ff.comment,  "
			+ "    ff.elec_total "
			+ "ORDER BY  "
			+ "    ff.date;"
			, nativeQuery = true)
	List<Object[]> searchForums(@Param("username") String username,
							@Param("region") String region, 
							@Param("elec_diff1") String elec_diff1,
							@Param("elec_diff2") String elec_diff2,
							@Param("start_date") String start_date, 
							@Param("end_date") String end_date);
	
	@Query(value = "select  "
			+ "round((final.used_fee + floor(final.elec_used * 9) + floor(final.elec_used * 5)) * .10)  "
			+ "+ floor( (final.used_fee + floor(final.elec_used * 9) + floor(final.elec_used * 5)) * .032) as total_fee,  "
			+ "final.elec_used as total_amount, "
			+ "round((final.prev_used_fee + floor(final.prev_elec_used * 9) + floor(final.prev_elec_used * 5)) * .10)  "
			+ "+ floor( (final.prev_used_fee + floor(final.prev_elec_used * 9) + floor(final.prev_elec_used * 5)) * .032) as prev_total_fee,  "
			+ "final.prev_elec_used as prev_total_amount "
			+ "from ( "
			+ "select  "
			+ "	fee_calculated.elec_used as elec_used, "
			+ "	case  "
			+ "    when fee_calculated.elec_used <= 300 then (fee_calculated.elec_used * 120) + 910 "
			+ "    when fee_calculated.elec_used > 300 and fee_calculated.elec_used <= 450 then (300 * 120 + (fee_calculated.elec_used - 300) * 214.6) + 1600 "
			+ "    else ((300 * 120 + 150 *214.6) + ((fee_calculated.elec_used - 450)* 307.3)) + 7300 "
			+ "    end as used_fee,     "
			+ "    fee_calculated.prev_elec_used as prev_elec_used, "
			+ "    case  "
			+ "    when fee_calculated.prev_elec_used <= 300 then (fee_calculated.prev_elec_used * 120) + 910 "
			+ "    when fee_calculated.prev_elec_used > 300 and fee_calculated.prev_elec_used <= 450 then (300 * 120 + (fee_calculated.prev_elec_used - 300) * 214.6) + 1600 "
			+ "    else ((300 * 120 + 150 *214.6) + ((fee_calculated.prev_elec_used - 450)* 307.3)) + 7300 "
			+ "    end as prev_used_fee        "
			+ "from( "
			+ "	select  "
			+ "    sum(monthly_used.elec_diff) as elec_used, "
			+ "    sum(prev_used.elec_diff) as prev_elec_used "
			+ "from( "
			+ "select date, elec_total, elec_diff from forum  "
			+ "where date between :date and date_add(:date, interval 1 month) "
			+ "and username= :username "
			+ ") as monthly_used "
			+ "join (  "
			+ "select date, elec_total, elec_diff from forum  "
			+ "where date between date_sub(date_sub(:date, interval 1 day) , interval 1 month) and date_sub(:date, interval 1 day)  "
			+ "and username= :username "
			+ ") as prev_used "
			+ ") as fee_calculated "
			+ ") as final;  ", 
			nativeQuery = true) 
	List<Object[]> electricity_fee(@RequestParam String date,
							@RequestParam String username);
	
	
	@Query(value= "select e.price_avg, e.date "
			+ "from electricity e "
			+ "where e.city = :city and e.county=:county  "
			+ "and ((month(date) = month(:date) and year(date) = year(:date)) "
			+ "or  "
			+ "(month(date) = month(date_sub(:date, interval 1 month)) and year(date) = year(date_sub(:date, interval 1 month)))); ",
			nativeQuery = true)
	List<Object[]> average_fee(@RequestParam String date,
								@RequestParam String city,
								@RequestParam String county
								);
	
//	@Query(value = "select *, ", nativeQuery = true)
//	List<Object[]> combineWeatherData(@Param("date") String date);
	
}
