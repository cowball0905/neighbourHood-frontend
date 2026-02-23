<template>
    <div class="post-card">
        <el-skeleton animated>
            <template #template>
            <div class="post-header">
                <div class="post-author">
                    <el-skeleton style="--el-skeleton-circle-size: 50px">
                        <template #template>
                            <el-skeleton-item variant="circle" />
                        </template>
                    </el-skeleton>
                <div class="author-info">
                    <el-skeleton-item variant="p" style="width: 30%"/>
                </div>
                </div>
            </div>

            <div class="post-content">
                <div class="post-information">
                    <el-skeleton-item variant="p" class="post-title"/>
                    <el-skeleton-item variant="p" class="post-range"/>
                </div>
                <el-skeleton-item variant="text" class="post-text" />
                <el-skeleton-item variant="image" class="image" style="width: 100px; height: 100px" />
            </div>
            </template>
        </el-skeleton>
    </div>
</template>

<style scoped>
.tag {
  max-width: 100px;
  margin-top: auto;
}

.post-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.post-information {
  color: black;
}

.post-title {
  font-size: 20px;
  font-weight: 800;
}

.post-range {
  font-size: 10px;
}

.image {
  display: flex;
  gap: 20px;
  overflow: hidden;
  margin: 20px 0;
  ;
}

.post-card {
    box-sizing: border-box;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  min-width: 600px;
  width: 600px;
  max-width: 600px;
  padding: 20px;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  margin: 0;
  font-weight: 600;
  color: #333;
}

.post-time {
  margin: 0;
  font-size: 16px;
  color: #999;
}


.post-title {
  overflow: hidden;
  white-space: nowrap;
}

.post-content p {
  margin: 12px 0 12px 0;
  color: #666;
  line-height: 1.6;
}


.post-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more {
  color: #409eff;
  cursor: pointer;
  font-weight: 600;
  margin-left: 4px;
  transition: color 0.3s;
}

.read-more:hover {
  color: #66b1ff;
  text-decoration: underline;
}

.post-footer {
  display: flex;
  justify-content: space-between;
}
</style>
