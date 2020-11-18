cmake_minimum_required(VERSION 3.14)

project(rematch-js LANGUAGES CXX)

set(REmatch_ROOT ${PROJECT_SOURCE_DIR}/REmatch)

# The output path for .wasm and .js files
set(EXECUTABLE_OUTPUT_PATH "${PROJECT_SOURCE_DIR}/lib")

# Set directories to include from REmatch
include_directories(SYSTEM ${REmatch_ROOT}/thirdparty)
include_directories(${REmatch_ROOT}/src)

# Call the CMakeLists.txt inside REmatch submodule
add_subdirectory(REmatch)

add_subdirectory(src)
