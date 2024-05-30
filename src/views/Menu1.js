import { useState, useEffect, useRef } from "react";
import SelectBox from "../components/SelectBox";

export default function Menu1() {
    const [tdata, setTdata] = useState(); // total data
    const [ops, setOps] = useState(); // 지하철 역
    const selRef = useRef(); // 옵션 선택

    //data fetch
    const getFetchData = (url) => {
        fetch(url)
            .then((resp) => resp.json())
            .then((data) => {
                console.log("fetch", data);
                setTdata(data.getIndoorAirQualityByItem.body.items.item);
            });
        // console.log("getFetchData", url);
    };

    // 컴포넌트 생성 시 한번 실행
    useEffect(() => {
        let url = `https://apis.data.go.kr/6260000/IndoorAirQuality/getIndoorAirQualityByItem?`;
        url = url + `serviceKey=${process.env.REACT_APP_API_KEY}`;
        url = url + `&pageNo=1&numOfRows=5&resultType=json`;
        url = url + `&controlnumber=2024052918&item=co`;
        // 공공 api 서비스 키 노출을 막기 위해 환경변수 설정
        getFetchData(url);
    }, []);

    //데이터가 fetch 되었을때 select ops 뿌리기
    useEffect(() => {
        if (!tdata) return;
        console.log(tdata);
        let tm = tdata.map((item) => item.site);
        tm = [...new Set(tm)].sort();
        setOps(tm);
    }, [tdata]);

    // select 옵션 선택시 필터링 된 데이터 뿌리기
    const handleSelect = () => {
        console.log(selRef.current.value);

    };

    return (
        <div>
            <div className="title">부산 지하철 실내공기질 정보</div>
            <div className="condition-card">
                <form className="w-full flex items-center h-full">
                    <div className="flex items-center">
                        <label
                            htmlFor="op"
                            className="text-sm font-bold
                              inline-flex justify-center items-center mb-5 md:mb-0 mr-5
                             text-gray-900 dark:text-white"
                        >
                            역 :
                        </label>
                        {ops && (
                            <SelectBox
                                id="op"
                                selRef={selRef}
                                ops={ops}
                                initText="---역 선택 ---"
                                handleChange={handleSelect}
                                customClass={"border p-2 rounded-md text-sm"}
                            />
                        )}
                    </div>
                </form>
            </div>
            <div>
              화면 출력
            {/* {cards} */}
            </div>
        </div>
    );
}
