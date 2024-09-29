from dataclasses import dataclass


@dataclass
class CommonError:
    code: int
    status: str
    msg: str


def success(msg):
    return CommonError(201, "success", msg)


def ok(msg):
    return CommonError(200, "ok", msg)


def bad_request(msg):
    return CommonError(400, "invalid argument", msg)


def not_found(msg):
    return CommonError(404, "not found", msg)


def internal():
    return CommonError(500, "internal", "internal error")
