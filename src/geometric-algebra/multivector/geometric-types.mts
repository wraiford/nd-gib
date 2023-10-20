/**
 * base class for GA object...probably will change. may end up compiling this
 * type of class depending on how things go in the future. I'm just blah-ing
 * something down for right now.
 */
export interface GeometricNumber2D {
    a: number;
    x: number;
    y: number;
    b: number;
}

export class GeometricNumber2D_V1 implements GeometricNumber2D {

    constructor(public a: number, public x: number, public y: number, public b: number) {

    }

    neg(rhs: GeometricNumber2D): GeometricNumber2D {
        return new GeometricNumber2D_V1(-this.a, -this.x, -this.y, -this.b)
    }
    rev(rhs: GeometricNumber2D): GeometricNumber2D {
        return new GeometricNumber2D_V1(-this.a, -this.x, -this.y, -this.b)
    }

    squared_norm(rhs: GeometricNumber2D): GeometricNumber2D {
        throw new Error(`not impl (E: 65450d427f1e57753224c8b6792dd123)`);
    }
}

let x: GeometricNumber2D_V1 = new GeometricNumber2D_V1(0, 0, 0, 0);
