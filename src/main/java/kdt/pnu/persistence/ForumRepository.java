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
	
	@Query(value = "with montly_used as ( "
			+ "select date, elec_total, elec_diff from forum  "
			+ "where date between date_sub(:date,interval 1 day) and date_add(date_sub(:date,interval 1 day), interval 1 month) "
			+ "and username= :username "
			+ "), "
			+ "prev_used as ( "
			+ "select date, elec_total, elec_diff from forum  "
			+ "where date between date_sub(date_sub(:date, interval 1 day) , interval 1 month) and date_sub(:date, interval 1 day)  "
			+ "and username= :username "
			+ "), "
			+ "monthly_sum_elec as (  "
			+ "	select  "
			+ "    sum(m.elec_diff) as elec_used "
			+ "    from montly_used m "
			+ "),  "
			+ "prev_sum_elec as (  "
			+ "	select  "
			+ "    sum(p.elec_diff) as prev_elec_used "
			+ "    from prev_used p "
			+ "), "
			+ "this_final as ( "
			+ "select  "
			+ "	ms.elec_used as elec_used, "
			+ "	case  "
			+ "    when ms.elec_used <= 200 then floor((ms.elec_used * 120)) + 910 "
			+ "    when ms.elec_used > 200 and ms.elec_used <= 400 then floor((200 * 120 + (ms.elec_used - 200) * 214.6)) + 1600 "
			+ "    else floor(((200 * 120 + 200 *214.6 +(ms.elec_used - 400)* 307.3))) + 7300"
			+ "    end as this_used_fee "
			+ "from monthly_sum_elec ms  "
			+ "), "
			+ "prev_final as( "
			+ "	select  "
			+ "    ps.prev_elec_used as prev_elec_used, "
			+ "    case  "
			+ "    when ps.prev_elec_used <= 200 then floor((ps.prev_elec_used * 120)) + 910 "
			+ "    when ps.prev_elec_used > 200 and ps.prev_elec_used <= 400 then floor((200 * 120 + (ps.prev_elec_used - 200) * 214.6)) + 1600 "
			+ "    else floor(((200 * 120 + 200 *214.6 +(ps.prev_elec_used - 400)* 307.3))) + 7300"
			+ "    end as prev_used_fee        "
			+ "from  prev_sum_elec ps  "
			+ ") "
			+ "select  "
			+ "floor((round((tf.this_used_fee + floor(tf.elec_used * 9) + floor(tf.elec_used * 5)) * .10)  "
			+ "+ floor( ((tf.this_used_fee + floor(tf.elec_used * 9) + floor(tf.elec_used * 5)) * .037 / 10)) * 10  "
			+ "+ tf.this_used_fee + floor(tf.elec_used * 9) + floor(tf.elec_used * 5)) / 10) * 10  as total_fee,  "
			+ "tf.elec_used as total_amount, "
			
			+ "floor((round((pf.prev_used_fee + floor(pf.prev_elec_used * 9) + floor(pf.prev_elec_used * 5)) * .10)  "
			+ "+ floor( ((pf.prev_used_fee + floor(pf.prev_elec_used * 9) + floor(pf.prev_elec_used * 5)) * .037 / 10)) * 10  "
			+ "+ pf.prev_used_fee + floor(pf.prev_elec_used * 9) + floor(pf.prev_elec_used * 5)) / 10) * 10 as prev_total_fee, "
			+ "pf.prev_elec_used as prev_total_amount "
			
			+ "from this_final tf, prev_final pf; ", 
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

}
