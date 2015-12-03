
h3 引数のオブジェクト化
引数は順番に列挙できるが・・・？

setUserInfo(firstName, lastName) {/*処理略*/}

// ミドルネームを指定できるようにする。引数の順番が違うのでミドルネームを使わなくても影響あり
setUserInfo(firstName, middleName, lastName) {}

// ミドルネームを指定できるようにする。が、使用しない箇所からの呼び出しには影響しないやりかた
setUserInfo(firstName, lastName, middleName) {}

// 今度は年齢を入れることになりました。
setUserInfo(firstName, lastName, middleName, age) {}

// 年齢を入れない場合、生年月日を入れるでもOKになりました
setUserInfo(firstName, lastName, middleName, age, birthday) {}

こんなことありますよね。

これを引数オブジェクトにすることで万事解決
setUserInfo(userInfo) {
	this.firstName = userInfo.firstName;
	this.middleName = userInfo.middleName || "";
	this.lastName = userInfo.lastName;

	this.age = userInfo.age || getAge(userInfo.birthday);
}

ミドルネームを使わない場合、使用者側の変更なし。
ageを使っていれば、birthdayの追加タイミングでの変更は不要。
それぞれのチェックも共通関数側で行えるようになります。

欠点としてはparam.firstNameの様に呼び出し側の記述量が増えることでスペルミスのリスクが増えます。
* TypeScriptを使っていると型チェックができ、インテリセンスで候補が表示されるので安心です。

// 型定義
interface UserInfo {
	firstName: string;
	middleName?: string;
	lastName: string;
	age?: number;
	birthday?: Date;
}

// 関数側で受ける型を指定
setUserInfo(userInfo:UserInfo) {}