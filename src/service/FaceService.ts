// 一時的にシングルトンで対応する。

export interface FaceResult {
  gender: 'male' | 'female' | 'unknown';
  age: number;
  marriage: boolean;
  haveChildren: boolean;
  genderJa: string;
  marriageJa: string;
  haveChildrenJa: string;
}

export default class FaceService {
  private static instance: FaceService;

  private faceResult: FaceResult = {
    gender: 'male',
    age: 50,
    marriage: true,
    haveChildren: true,
    genderJa: '男性',
    marriageJa: '既婚',
    haveChildrenJa: 'いる',
  };

  public static default(): FaceService {
    if (!FaceService.instance) {
      FaceService.instance = new FaceService();
    }
    return FaceService.instance;
  }

  get() {
    return this.faceResult;
  }

  setGender(gender: 'male' | 'female' | 'unknown') {
    this.faceResult.gender = gender;
    this.faceResult.genderJa = gender === 'male' ? '男性' : '女性';
  }

  setAge(age: number) {
    const value = Math.floor(age / 10) * 10;
    this.faceResult.age = value;
  }

  setMarriage(marriage: boolean) {
    this.faceResult.marriage = marriage;
    this.faceResult.marriageJa = marriage ? '既婚' : '独身';
  }

  setHaveChildren(children: boolean) {
    this.faceResult.haveChildren = children;
    this.faceResult.haveChildrenJa = children ? 'いる' : 'いない';
  }

}
