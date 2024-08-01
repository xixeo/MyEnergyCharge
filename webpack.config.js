const path = require('path');

module.exports = {

  module: {
    rules: [
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, 'src/icons'), // SVG 파일들이 위치한 디렉토리
        use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000, // 파일 크기 제한 (10KB 이하의 파일은 inline)
                name: 'static/media/[name].[hash:8].[ext]'
              }
            }
          ]
    //     use: [
    //       {
    //         loader: 'svg-sprite-loader',
    //         options: {
    //           symbolId: 'icon-[name]' // 아이콘의 ID 형식
    //         }
    //       },
    //       'svgo-loader'
    //     ]
    //   }
    ]
  },

};