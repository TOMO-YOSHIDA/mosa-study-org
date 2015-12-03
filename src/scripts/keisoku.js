// IEにはconsole.time関数がないので自作する
!function (g) {

	var dummyFunction = function () { };
	var console = g['console'] = g.console || {
		log: dummyFunction,
		error: dummyFunction,
		debug: dummyFunction,
	};

	// ここに計測開始時間をキャッシュ
	var cache = {};

	// 計測開始関数の追加
	if (!console.time) {
		console.time = function (key) {
			cache[key] = Date.now();
		};
	}

	// 計測終了関数の追加
	if (!console.timeEnd) {
		console.timeEnd = function (key) {
			var end = Date.now();
			var start = cache[key];
			if (!key) return; // 対応する開始時間がなければ抜ける

			console.log(end - start + " ms");
			delete cache[key]; // キャッシュのお掃除
		};
	}
}