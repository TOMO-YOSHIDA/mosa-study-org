"use strict";

// IEにはconsole.time関数がないので自作する
!function (g) {

	var dummyFunction = function () { };
	var console = g.console || {
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

// 計測用関数の用意
!function (g) {
	var Keisoku = g["Keisoku"] = g.Keisoku || {};

	/*
		計測用の関数。
		@param params : object
			.title 必須：タイトル
			.loopCount 必須：ループ回数
			.func 必須：実行関数
			.args 実行時引数
			.context 実行関数のコンテキスト
	*/
	Keisoku.time = function (title, loopCount, func, args, context) {
		console.log('time is start!');
		var params = title;
		// titleがstringじゃないならオブジェクト
		if (typeof title === 'string') {
			params = {
				title: title,
				loopCount: loopCount,
				func: func,
				args: args,
				context: context
			};
		}

		// 必須チェック
		var isError = false;
		['title', 'loopCount', 'func'].forEach(function (r) {
			if (!params[r]) {
				console.log('%s undefined.', r);
				isError = true;
			}
		});
		console.log('is error? :%s', isError);
		if (isError) return;

		// funcが関数か？
		if (typeof params.func !== 'function') return console.log('fnc is not Function');

		// argsは配列である必要がある
		if (Array.isArray(params.args)) {
			params.args.forEach(function (v, i, arr) {
				if (!Array.isArray(v)) {
					arr[i] = [v];
				}
			});
		} else {
			params.args = [params.args];
		}

		// ここから計測
		console.time(params.title);
		if (Array.isArray(params.args)) {
			for (var i = params.loopCount; i--;) {
				params.args.forEach(function (a) {
					params.func.apply(params.context, a);
				});
			}
		} else {
			for (var i = params.loopCount; i--;) {
				params.func.apply(params.context, params.args)
			}
		}
		console.timeEnd(params.title);
	};
} (window);