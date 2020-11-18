
# Name of target
set(target "rematch_wasm")

# Set compilation flags
set(REmatch_FLAGS "\
--bind \
-s WASM_ASYNC_COMPILATION=0 \
-s ALLOW_MEMORY_GROWTH=1 \
")

# Set the executable .cpp
add_executable(${target} wasm.cpp)

# Link against the project libraries
target_link_libraries(${target} rematchlib)

# Target uses C++17
set_property(TARGET ${target} PROPERTY CXX_STANDARD 17)

# Add compilation flags to the target
set_target_properties(${target} PROPERTIES LINK_FLAGS ${REmatch_FLAGS})