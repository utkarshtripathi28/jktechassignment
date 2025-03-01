const paginate = async (data) => {
  let totalPage = 0;
  let totalPerpage = 0;
  let currentPage = 0;
  let previousPage = 0;
  let nextPage = 0;
  if (data.data.length > 0) {
    totalPage = Math.ceil(data.count / data.limit);
    totalPerpage = data.limit;
    currentPage = data.page;
    previousPage = currentPage == 1 ? 0 : currentPage - 1;
    nextPage = currentPage == totalPage ? 0 : currentPage + 1;
  }

  let result = {
    data: data.data,
    pagination: {
      totalRecords: data.count,
      totalPerpage: totalPerpage,
      totalPage,
      currentPage,
      nextPage,
      previousPage,
    },
  };
  return result;
};

module.exports = { paginate };
