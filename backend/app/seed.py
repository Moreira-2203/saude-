from __future__ import annotations

import argparse

from .seeds.seed_empty import seed_empty
from .seeds.seed_mocks import seed_mocks


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed database")
    parser.add_argument("--mode", choices=["empty", "mocks"], default="mocks")
    args = parser.parse_args()

    if args.mode == "empty":
        seed_empty()
    else:
        seed_mocks()


if __name__ == "__main__":
    main()
