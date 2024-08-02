import { useEffect, useRef } from "react";

const Pagination = ({ pagination }) => {
  const paginationRef = useRef(null);

  useEffect(() => {
    const displayPagination = (pagination) => {
      const paginationEl = paginationRef.current;
      const fragment = document.createDocumentFragment();
      while (paginationEl?.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
      }

      for (let i = 1; i <= pagination.last; i++) {
        const el = document.createElement("a");
        el.href = "#";
        el.innerHTML = String(i);

        if (i === pagination.current) {
          el.className = "on";
        } else {
          el.onclick = () => pagination.gotoPage(i);
        }

        fragment.appendChild(el);
      }
      paginationEl?.appendChild(fragment);
    };

    if (pagination) {
      displayPagination(pagination);
    }
  }, [pagination]);

  return <div ref={paginationRef} id="pagination"></div>;
};

export default Pagination;
